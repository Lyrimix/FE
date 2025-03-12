export const AutoDismissToast = ({
  message,
  duration = 3000,
  color = "success",
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;

    if (message) {
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message || !visible) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <Toast isOpen={visible} fade color={color}>
        <ToastHeader icon={color}>Notification</ToastHeader>
        <ToastBody>{message}</ToastBody>
      </Toast>
    </div>
  );
};
