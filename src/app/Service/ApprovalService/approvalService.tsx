import axios from "axios";

const approveStore = async () => {
    try {
        const response = await axios.post(`http://localhost:8080/api/superadmin/approve`);
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