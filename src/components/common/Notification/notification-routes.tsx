export const notificationRoutes: Record<string, (data: any) => string> = {
  // Novel
  "USER LIKED NOVEL": (d) => `/entertainment/novel/details/${d.titleId}`,
  "USER COMMENT ON NOVEL": (d) => `/entertainment/novel/details/${d.titleId}`,

  // Comic
  "USER LIKED COMIC": (d) => `/entertainment/comics/details/${d.titleId}`,
  "USER COMMENT ON COMIC": (d) => `/entertainment/comics/details/${d.titleId}`,

  // Story
  "USER LIKED STORY": (d) => `/entertainment/storytelling/details/${d.titleId}`,
  "USER COMMENT ON STORY": (d) =>
    `/entertainment/storytelling/details/${d.titleId}`,

  // Gallery
  "USER LIKED GALLERY": (d) => `/entertainment/gallery/details/${d.titleId}`,
  "USER COMMENT ON GALLERY": (d) =>
    `/entertainment/gallery/details/${d.titleId}`,

  // MuzeBox
  "USER LIKED MUZEBOX": (d) => `/entertainment/muzebox/details/${d.titleId}`,
  "USER COMMENT ON MUZEBOX": (d) =>
    `/entertainment/muzebox/details/${d.titleId}`,

  // Education
  "USER LIKED EDUCATION": (d) =>
    `/entertainment/educatin/grades/details/${d.titleId}`,

  // Museum
  "USER LIKED MUSEUM": (d) => `/entertainment/museum/details/${d.titleId}`,

  // Post
  "USER LIKED POST": (d) => `/entertainment/posts/details/${d.titleId}`,
  "USER COMMENT ON POST": (d) => `/entertainment/posts/details/${d.titleId}`,
};

export const getNotificationRoute = (type: string, data: any): string => {
  const routeBuilder = notificationRoutes[type];
  return routeBuilder ? routeBuilder(data) : "/";
};
