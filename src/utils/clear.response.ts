export function clearData(objects: any) {
  // Clears null data and passwords
  const jsonStr = JSON.stringify(objects, (k, v) => (
    (v === null || k === 'password' || k === '__v') ? undefined : v
  ));

  return JSON.parse(jsonStr);
}
