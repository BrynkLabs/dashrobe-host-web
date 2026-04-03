import axios from "axios";
import { axiosClient } from "../AxiosClient/axiosClient";

const approveStore = async () => {
    try {
        const response = await axiosClient.post(`/api/superadmin/approve`);
        if (response.status === 200){
            return response;
        } else {
            throw new Error("Failed to approve store");
        }
    } catch (error) {
        console.error("Error approving store:", error);
    }
};

export default approveStore;