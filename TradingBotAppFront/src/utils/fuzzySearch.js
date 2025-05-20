import Fuse from "fuse.js";

export const fuzzySearch = (list, query, keys = ["Company"]) => {
  if (!query || query.trim() === "") return list;

  const fuse = new Fuse(list, {
    keys: keys,
    threshold: 0.4, // plus bas = plus strict
    distance: 100,
  });

  return fuse.search(query).map((result) => result.item);
};