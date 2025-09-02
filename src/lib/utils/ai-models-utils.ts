export interface ModelTag {
	name: string;
}

export interface ModelMeta {
	hidden?: boolean;
	description?: string;
	tags?: ModelTag[];
	profile_image_url?: string | null; // precisa permitir null
}

export interface ModelInfo {
	meta?: ModelMeta;
}

export interface Model {
	name: string;
	info?: ModelInfo;
	// outros campos possíveis
}

export interface NormalizedModel extends Model {
	modelName: string;
	tags: string;
	desc?: string;
	info: {
		meta: {
			hidden?: boolean;
			description?: string;
			tags?: ModelTag[];
			profile_image_url: string | null; // agora garantido no final
		};
	};
}


export function getModelIcon(modelName: string) {
  if (!modelName) return null;

  const name = modelName.toLowerCase()

  if (name.includes("gpt")) {
    return "/static/gptai-logo.png";
  }
  if (name.includes("meta") || name.includes("llma")) {
    return "/static/metaai-logo.png";
  }
  if (name.includes("cohere") || name.includes("command")) {
    return "/static/cohereai-logo.png";
  }

  if (name.includes("grok") || name.includes("command")) {
    return "/static/grokai-logo.png";
  }

  return "/static/favicon.png"; // fallback
}

export function normalizeModel(model: Model): NormalizedModel | null {
  console.log('chamou')
	if (model?.info?.meta?.hidden) return null;

	const meta = model.info?.meta || {};
	const tags = meta.tags?.map((tag) => tag.name).join(' ') || '';

	return {
		...model,
		modelName: model.name,
		tags,
		desc: meta.description,
		info: {
			...model.info,
			meta: {
				...meta,
				profile_image_url: meta.profile_image_url || getModelIcon(model.name),
			},
		},
	};
}