import type {pageTourSaveData, tourSaveData, userTourSaveData} from "@/views/Guidance/shepherd";
import {defaultTourSaveData, defaultUserPageTourData} from "@/views/Guidance/shepherd";
import {setLocalStorageItem} from "@/utils/utils";


export const disableTour = (username: string, pageName: string) => {
   const tourData: tourSaveData = getTourSaveData(username, pageName);
   const userData = getUserTourSaveData(username, pageName, tourData);
   userData.disabled = true;
   saveTourData(tourData);
}


export const userTourDisabled = (username: string, pageName: string, tourSave: tourSaveData | null = null) => {
   const userTourSave = getUserTourSaveData(username, pageName, tourSave);
   return userTourSave.disabled;
}


export const completePageTour = (username: string, pageName: string) => {
   const tourData: tourSaveData = getTourSaveData(username, pageName);
   // window.alert('saving tour' + JSON.stringify(tourData))

   const userPageData = getUserPageTourData(username, pageName, tourData);
   // window.alert('saving userdata' + JSON.stringify(userPageData))

   userPageData.done = true;
   // window.alert('saving userdata' + JSON.stringify(userPageData))

   saveTourData(tourData);
}


export const pageTourDone = (username: string, pageName: string, tourSave: tourSaveData | null = null) => {
   // window.alert(JSON.stringify(getUserPageTourData(username, pageName, tourSave)))
   return getUserPageTourData(username, pageName, tourSave).done;
}


export const savePageTourData = (username: string, pageName: string, saveData: pageTourSaveData) => {
   const tourData: tourSaveData = getTourSaveData(username, pageName);
   const userData = getUserTourSaveData(username, pageName, tourData);
   let userTourData: userTourSaveData = userData.tourData;
   userTourData[pageName] = saveData;
   saveTourData(tourData);
}


export const getTourSaveData = (username: string, pageName: string) => {
   const tourSaveString = localStorage.getItem('tourSave');
   const tourSave: tourSaveData = tourSaveString ? JSON.parse(tourSaveString) : createTourSaveData(username, pageName);
   return tourSave;
}


export const getUserTourSaveData = (username: string, pageName: string, tourSave: tourSaveData | null = null) => {
   if (!tourSave){
      tourSave = getTourSaveData(username, pageName);
   }

   if (!(tourSave[username])){
      tourSave[username] = defaultTourSaveData(username, pageName)[username];
   }
   return tourSave[username];
}


export const getUserPageTourData = (username: string, pageName: string, tourSave: tourSaveData | null = null) => {
   const userTourSave = getUserTourSaveData(username, pageName, tourSave);
   if (!userTourSave.tourData[pageName]) {
      userTourSave.tourData[pageName] = defaultUserPageTourData();
   }
   return userTourSave.tourData[pageName];
}


export const createTourSaveData = (username: string, pageName: string) => {
   const tourSaveString = localStorage.getItem('tourSave');
   if (tourSaveString){
      const tourSaveData: tourSaveData = JSON.parse(tourSaveString);
      return tourSaveData
   }
   const tourSaveData: tourSaveData = defaultTourSaveData(username, pageName);
   saveTourData(tourSaveData);
   return tourSaveData;
}


export const saveTourData = (tourDataObj: tourSaveData) => {
   // window.alert('saving ' + JSON.stringify(tourDataObj))
   setLocalStorageItem('tourSave', JSON.stringify(tourDataObj));
}
