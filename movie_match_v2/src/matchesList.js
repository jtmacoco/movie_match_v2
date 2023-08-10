import React from 'react'
import { userData } from './userData'

export const matchList = async (currentUser) => {
    const getUsersData= async () => {
        const res = await userData();
        const filterData = res.filter(item => item.uid !== currentUser.uid);
        return filterData;
    };
    const getCurUserData = async () => {
        const res = await userData();
        const filterData = res.filter(item => item.uid === currentUser.uid);
        return filterData;
    };

    const usersData= await getUsersData();
    const curUserData = await getCurUserData()
    
    return usersData;
};