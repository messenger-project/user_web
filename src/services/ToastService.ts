import { toast, ToastContent } from 'react-toastify';

class ToastService {
  private messageId: string | number = '';

  showLoading(message: ToastContent = 'درحال انجام عملیات...'): void {
    this.messageId = toast(message, this.loadingOptions());
  }

  updateSuccess(message: ToastContent): void {
    toast.update(this.messageId, this.successOptions(message));
  }

  updateError(message: ToastContent): void {
    toast.update(this.messageId, this.errorOptions(message));
  }

  private successOptions(message: ToastContent): object {
    return {
      isLoading: false,
      render: message,
      position: 'bottom-center',
      autoClose: 8000,
      style: { background: '#64bb6a', color: 'white', textAlign: 'right' },
      progressStyle: { background: 'green' },
    };
  }

  private errorOptions(message: ToastContent): object {
    return {
      isCancel: false,
      isLoading: false,
      render: message,
      position: 'bottom-center',
      autoClose: 8000,
      style: { background: '#e04a4a', color: 'white', textAlign: 'right' },
      progressStyle: { background: 'white' },
    };
  }

  private loadingOptions(): object {
    return {
      isCancel: false,
      isLoading: true,
      position: 'bottom-center',
      autoClose: 8000,
      style: { background: '#fff', color: '#252525', textAlign: 'right' },
      progressStyle: { background: 'green' },
    };
  }
}

export default new ToastService();
