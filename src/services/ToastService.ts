import { toast, ToastContent, Id } from "react-toastify";

class ToastService {
    showLoading(message: ToastContent = "Processing..."): Id {
        return toast.loading(message, {
            position: "bottom-center",
            autoClose: false,
            style: {
                background: "#fff",
                color: "#252525",
                textAlign: "right",
            },
        });
    }

    showError(message: ToastContent): void {
        toast.error(message, {
            position: "bottom-center",
            autoClose: 8000,
        });
    }

    updateSuccess(message: ToastContent, id: Id): void {
        toast.update(id, {
            render: message,
            type: "success",
            isLoading: false,
            autoClose: 8000,
            style: {
                background: "#64bb6a",
                color: "white",
                textAlign: "right",
            },
        });
    }

    updateError(message: ToastContent, id: Id): void {
        toast.update(id, {
            render: message,
            type: "error",
            isLoading: false,
            autoClose: 8000,
            style: {
                background: "#e04a4a",
                color: "white",
                textAlign: "right",
            },
        });
    }
}

const toastService = new ToastService();

export default toastService;