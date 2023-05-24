declare const findImagePathByName: (name: string) => string | undefined;
declare const deleteImages: (name: string) => Promise<void>;
export { findImagePathByName, deleteImages };
