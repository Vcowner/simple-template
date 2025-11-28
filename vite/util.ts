type ObjectWithKeys<T> = {
  [K in keyof T]: T[K];
};

export function pick<T, K extends keyof T>(obj: ObjectWithKeys<T>, keys: K[]): Partial<T> {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
}
