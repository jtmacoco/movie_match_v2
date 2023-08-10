import { userData } from './userData'
function checkGenres(arr1, arr2, priority) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) {
            //console.log("genres id arr1: ", arr1[i]);
            priority++;
        }
    }
    //console.log("checkGenres priority: ", priority)
    return priority;
}
export const matchList = async (currentUser) => {
    const getUsersData = async () => {
        const res = await userData();
        const filterData = res.filter(item => item.uid !== currentUser.uid);
        return filterData;
    };
    const getCurUserData = async () => {
        const res = await userData();
        const filterData = res.filter(item => item.uid === currentUser.uid);
        return filterData;
    };

    const usersData = await getUsersData();
    const curUserData = await getCurUserData()
    const curUserMovieList = curUserData.map((curData) => {
        return curData.movieList;
    })
    const usersMovieList = new Map()
    usersData.forEach(user => {
        usersMovieList.set(user.username, { movieList: user.movieList })
    })
    const priorityList = new Map();
    usersData.forEach((user) => {
        priorityList.set(user.username, { priority: 0, movieList: user.movieList, uid:user.uid})
    })
    for (const [key, value] of usersMovieList.entries()) {
        value.movieList.forEach(usersMovie => {
            curUserMovieList[0].forEach(curMovie => {
                let userPriority = priorityList.get(key);
                if (curMovie.title === usersMovie.title) {
                    //console.log("user: ", key, " movie has been found: ", curMovie.title)
                    userPriority.priority += 2;
                }
                userPriority.priority = checkGenres(curMovie.genre_ids, usersMovie.genre_ids, userPriority.priority)
         //       console.log("users: ", key, " priority: ", userPriority.priority)
            })
        })
    }
    //console.log("unsorted");
    //for(const [key, value] of priorityList.entries()){
    //    //console.log("key: ",key,"value: ",value)
    //}
    const sortedArray = [...priorityList.entries()]
    sortedArray.sort((a,b) => b[1].priority-a[1].priority);
    const sortedMap = new Map(sortedArray)
    //console.log("sortedMap")
    for(const [key, value] of sortedMap.entries()){
        //console.log("key: ",key,"value: ",value)
    }
    //console.log("sorted array: ", sortedArray);

    //console.log("priorityList: ",priorityList)
    //console.log("curMovieList", curUserMovieList)
    //console.log("usersData", usersData)
    //console.log("usersMovieList: ", usersMovieList)
    console.log("sorted aray: ",sortedArray);
    return sortedArray;
};