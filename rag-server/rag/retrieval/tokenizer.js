export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s]/g, "") // <-- Добавили а-я
    .split(/\s+/)
    .filter(Boolean);
}