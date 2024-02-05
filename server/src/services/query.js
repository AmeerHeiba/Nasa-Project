
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_LIMIT = 20;

// This function is responsible for setting the correct pagination parameters
function getPagination(query){

    // gets tge absolute pagination page from query if 100 returns 100 if -100 returns 100 and strings aswell.
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    // gets tge absolute pagination limit from query if 100 returns 100 if -100 returns 100 and strings aswell.
    const limit = Math.abs(query.limit) || DEFAULT_LIMIT;

    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    }


    
}

module.exports = {getPagination};