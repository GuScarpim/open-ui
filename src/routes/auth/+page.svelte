<script>
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';
	import { toast } from 'svelte-sonner';
	import { onMount, getContext, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { getBackendConfig } from '$lib/apis';
	import { ldapUserSignIn, getSessionUser, userSignIn, userSignUp } from '$lib/apis/auths';
	import { WEBUI_BASE_URL } from '$lib/constants';
	import { config, user, socket } from '$lib/stores';
	import { generateInitialsImage } from '$lib/utils';

	import Spinner from '$lib/components/common/Spinner.svelte';
	import OnBoarding from '$lib/components/OnBoarding.svelte';
	import SensitiveInput from '$lib/components/common/SensitiveInput.svelte';

	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';

	const i18n = getContext('i18n');

	let loaded = false;
	let onboarding = false;

	let mode = 'signin'; // 'signin' | 'signup' | 'ldap'

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let ldapUsername = '';

	let swap = false;
	$: panes = swap ? ['form', 'panel'] : ['panel', 'form'];

	const querystringValue = (key) => {
		const querystring = window.location.search;
		const urlParams = new URLSearchParams(querystring);
		return urlParams.get(key);
	};

	const setSessionUser = async (sessionUser) => {
		if (!sessionUser) return;
		toast.success($i18n.t(`You're now logged in.`));
		if (sessionUser.token) localStorage.token = sessionUser.token;

		$socket.emit('user-join', { auth: { token: sessionUser.token } });
		await user.set(sessionUser);
		await config.set(await getBackendConfig());

		const redirectPath = querystringValue('redirect') || '/';
		goto(redirectPath);
	};

	const signInHandler = async () => {
		const sessionUser = await userSignIn(email, password).catch((error) => {
			toast.error(String(error));
			return null;
		});
		await setSessionUser(sessionUser);
	};

	const signUpHandler = async () => {
		if ($config?.features?.enable_signup_password_confirmation && password !== confirmPassword) {
			toast.error($i18n.t('Passwords do not match.'));
			return;
		}
		const sessionUser = await userSignUp(name, email, password, generateInitialsImage(name)).catch(
			(error) => {
				toast.error(String(error));
				return null;
			}
		);
		await setSessionUser(sessionUser);
	};

	const ldapSignInHandler = async () => {
		const sessionUser = await ldapUserSignIn(ldapUsername, password).catch((error) => {
			toast.error(String(error));
			return null;
		});
		await setSessionUser(sessionUser);
	};

	const submitHandler = async () => {
		if (mode === 'ldap') await ldapSignInHandler();
		else if (mode === 'signin') await signInHandler();
		else await signUpHandler();
	};

	const checkOauthCallback = async () => {
		function getCookie(name) {
			const match = document.cookie.match(
				new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
			);
			return match ? decodeURIComponent(match[1]) : null;
		}
		const token = getCookie('token');
		if (!token) return;

		const sessionUser = await getSessionUser(token).catch((error) => {
			toast.error(String(error));
			return null;
		});
		if (!sessionUser) return;

		localStorage.token = token;
		await setSessionUser(sessionUser);
	};

	async function setLogoImage() {
		await tick();
		const el = /** @type {HTMLImageElement|null} */ (document.getElementById('powered-logo'));
		if (!el) return;
		const isDark = document.documentElement.classList.contains('dark');
		const url = isDark ? `/static/overlabs-logo-fit.png` : `/static/overlabs-logo-fit.png`;
		const img = new Image();
		img.src = url;
		img.onload = () => {
			el.src = url;
			el.style.filter = '';
		};
	}

	onMount(async () => {
		if ($user !== undefined) {
			const redirectPath = querystringValue('redirect') || '/';
			goto(redirectPath);
		}
		await checkOauthCallback();

		loaded = true;
		setLogoImage();

		if (($config?.features.auth_trusted_header ?? false) || $config?.features.auth === false) {
			await signInHandler();
		} else {
			onboarding = $config?.onboarding ?? false;
		}
	});

	function toggleAuth() {
		mode = mode === 'signin' ? 'signup' : 'signin';
		swap = !swap;
	}
</script>

<svelte:head>
	<title>{`${'Overlabs HUB AI'}`}</title>
</svelte:head>

<OnBoarding
	bind:show={onboarding}
	getStartedHandler={() => {
		onboarding = false;
		mode = $config?.features.enable_ldap ? 'ldap' : 'signup';
	}}
/>

<div class="w-full h-screen max-h-[100dvh] text-white relative" id="auth-page">
	<div class="w-full h-full absolute top-0 left-0 bg-white dark:bg-gray-800"></div>
	<div class="w-full absolute top-0 left-0 right-0 h-8 drag-region" />

	{#if loaded}
		<div class="fixed flex justify-center items-center h-full w-full">
			{#each panes as pane, i (pane)}
				<div
					animate:flip={{ duration: 300, easing: cubicOut }}
					class={`relative flex flex-col items-center justify-center lg:pt-12
									w-full max-w-md h-[480px] overflow-hidden
									${i === 0 ? 'rounded-l-2xl' : 'rounded-r-2xl'}
									${pane === 'panel' ? 'bg-[#91051F] text-white' : 'bg-white dark:bg-gray-800 shadow-lg'}
					`}
				>
					{#if pane === 'panel'}
						<div class="h-[200px] overflow-hidden flex items-center justify-center">
							<img
								src="/static/lorenzetti-logo-white-ia.png"
								class="max-h-28 w-auto object-contain"
								alt="Logo Lorenzetti"
							/>
						</div>

						<div
							class="absolute bottom-3 right-3 flex items-center gap-2 rounded-full px-3 py-1
											bg-black/30 text-white shadow-sm backdrop-blur-sm"
						>
							<span class="text-[11px] font-medium uppercase tracking-wide">Powered by</span>
							<img
								id="powered-logo"
								crossorigin="anonymous"
								src={document?.documentElement?.classList.contains('dark')
									? `${WEBUI_BASE_URL}/static/overlabs-logo-fit.png`
									: `${WEBUI_BASE_URL}/static/overlabs-logo-fit.png`}
								class="w-20 rounded-full object-contain"
								alt="Overlabs"
							/>
						</div>
					{:else}
						<form class="w-full px-8 flex flex-col gap-4" on:submit|preventDefault={submitHandler}>
							<div class="text-xl font-semibold text-center mb-2 text-dark dark:text-gray-100">
								{#if mode === 'ldap'}
									{$i18n.t(`Sign in to {{WEBUI_NAME}} with LDAP`, {
										WEBUI_NAME: 'Overlabs HUB AI'
									})}
								{:else if mode === 'signin'}
									{$i18n.t(`Sign in to {{WEBUI_NAME}}`, { WEBUI_NAME: 'Overlabs HUB AI' })}
								{:else}
									{$i18n.t(`Sign up to {{WEBUI_NAME}}`, { WEBUI_NAME: 'Overlabs HUB AI' })}
								{/if}
							</div>

							{#if mode === 'signup'}
								<div>
									<label for="name" class="text-sm font-medium block mb-1">{$i18n.t('Name')}</label>
									<input
										bind:value={name}
										type="text"
										id="name"
										class="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 py-2"
										autocomplete="name"
										placeholder={$i18n.t('Enter Your Full Name')}
										required
									/>
								</div>
							{/if}

							{#if mode === 'ldap'}
								<div>
									<label for="username" class="text-sm font-medium block mb-1"
										>{$i18n.t('Username')}</label
									>
									<input
										bind:value={ldapUsername}
										type="text"
										id="username"
										class="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 py-2"
										autocomplete="username"
										placeholder={$i18n.t('Enter Your Username')}
										required
									/>
								</div>
							{:else}
								<div>
									<label for="email" class="text-sm font-medium block mb-1"
										>{$i18n.t('Email')}</label
									>
									<input
										bind:value={email}
										type="email"
										id="email"
										class="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 py-2"
										autocomplete="email"
										placeholder={$i18n.t('Enter Your Email')}
										required
									/>
								</div>
							{/if}

							<div>
								<label for="password" class="text-sm font-medium block mb-1"
									>{$i18n.t('Password')}</label
								>
								<SensitiveInput
									bind:value={password}
									type="password"
									id="password"
									class="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 py-2"
									placeholder={$i18n.t('Enter Your Password')}
									autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
									required
								/>
							</div>

							{#if mode === 'signup' && $config?.features?.enable_signup_password_confirmation}
								<div>
									<label for="confirm-password" class="text-sm font-medium block mb-1">
										{$i18n.t('Confirm Password')}
									</label>
									<SensitiveInput
										bind:value={confirmPassword}
										type="password"
										id="confirm-password"
										class="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 py-2"
										placeholder={$i18n.t('Confirm Your Password')}
										autocomplete="new-password"
										required
									/>
								</div>
							{/if}

							<button
								class="bg-primary text-white font-medium rounded-full py-2 mt-2 hover:bg-primary/90 transition"
								type="submit"
							>
								{mode === 'ldap'
									? $i18n.t('Authenticate')
									: mode === 'signin'
										? $i18n.t('Sign in')
										: $i18n.t('Create Account')}
							</button>

							{#if mode !== 'ldap'}
								<div class="text-sm text-center mt-2 text-dark dark:text-gray-100">
									{mode === 'signin'
										? $i18n.t("Don't have an account?")
										: $i18n.t('Already have an account?')}
									<button class="font-medium underline ml-2" type="button" on:click={toggleAuth}>
										{mode === 'signin' ? $i18n.t('Sign up') : $i18n.t('Sign in')}
									</button>
								</div>
							{/if}

							{#if $config?.features.enable_ldap && $config?.features.enable_login_form}
								<div class="text-xs text-center mt-2">
									<button
										class="underline"
										type="button"
										on:click={() => {
											mode = mode === 'ldap' ? 'signin' : 'ldap';
										}}
									>
										{mode === 'ldap'
											? $i18n.t('Continue with Email')
											: $i18n.t('Continue with LDAP')}
									</button>
								</div>
							{/if}
						</form>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
