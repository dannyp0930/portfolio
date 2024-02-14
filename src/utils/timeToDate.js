export default (timestamp) => {
  const date = timestamp.toDate();
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  return `${YYYY}년 ${MM}월 ${DD}일`;
};
