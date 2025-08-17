export function omitKeysFromObject(
  keysToRemove: Array<string>,
  object: object,
) {
  const data = { ...object };
  for (const keys of keysToRemove) {
    delete data[keys];
  }
  return data;
}

export function omitKeysFromArray(
  keysToRemove: Array<string>,
  array: Array<Record<string, any>>,
) {
  const data = [...array];
  return data.map((item) => {
    for (const keys of keysToRemove) {
      delete item[keys];
    }
    return data;
  });
}
