import {post} from "@/utils/dataQuery";

export const getPjMapInfoAPI = async () => {
   const res = await post("/sales/get_pjs_map_info", {
      sorting: '-ttAvailSort',
   })
   if (!res) {
      console.log('Err during save snapshot');
   }
   return res
};
