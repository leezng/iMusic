/**
 * 获取一个对象内部某个属性的值
 */
export function getObjectValue(data: Record<string, unknown>, path?: string) {
  const p = path ? `data.${path}` : 'data';
  try {
    return new Function('data', `return ${p}`)(data);
  } catch (err) {
    console.warn(err);
  }
  return null;
}

/**
 * 得到一个两数之间的随机整数，包括两个数在内
 */
export function getRandomIntInclusive(_min: number, _max: number) {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
