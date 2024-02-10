export default class {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
        name: {
          $regex: this.queryStr.keyword,
          $options: 'i'
        }
      }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  find() {
    let queryStrForFind = { ...this.queryStr };
    const fieldsToBeDropped = ['keyword', 'page', 'resPerPage'];
    fieldsToBeDropped.forEach(fieldName => delete queryStrForFind[fieldName]);
    queryStrForFind = JSON.stringify(queryStrForFind);
    const comparisonKeyWords = ['ge', 'le', 'gt', 'lt'];
    comparisonKeyWords.every(comparisonKeyWord => {
      if (queryStrForFind.includes(comparisonKeyWord)) {
        queryStrForFind = queryStrForFind.replace(
          comparisonKeyWord,
          `$${comparisonKeyWord}`
        );
        return false;
      }
      return true;
    });
    queryStrForFind = JSON.parse(queryStrForFind);
    this.query = this.query.find(queryStrForFind);
    return this;
  }

  pagination() {
    const currentActivePage = Number(this.queryStr.page) || 1;
    const numberOfResultsToBeSkipped = this.queryStr.resPerPage * (currentActivePage - 1);
    this.query = this.query.limit(this.queryStr.resPerPage).skip(numberOfResultsToBeSkipped);
    return this;
  }
}
