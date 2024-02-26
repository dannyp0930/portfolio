export default (timestamp) => {
  const date = timestamp.toDate();
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  return `${YYYY}.${MM}.${DD}`;
};
