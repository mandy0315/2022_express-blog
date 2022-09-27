const pagination = ({ articlesInfo, currectPage, perPage }) => {
  const totalCounts = articlesInfo.length;
  const totalPage = Math.ceil(totalCounts / perPage);

  if (currectPage > totalPage) {
    currectPage = totalPage;
  }

  const minItem = currectPage * perPage - perPage + 1;
  const maxItem = currectPage * perPage;
  let data = [];
  articlesInfo.forEach((item, i) => {
    const itemNum = i + 1;
    if (itemNum >= minItem && itemNum <= maxItem) {
      data.push(item);
    }
  });

  const page = {
    totalPage,
    currectPage,
    hasPrev: currectPage > 1,
    hasNext: currectPage < totalPage,
  };

  return {
    data,
    page,
  };
};
module.exports = pagination;
