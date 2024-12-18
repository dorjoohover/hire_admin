import { Modal, Button } from "antd";
import { WarningIcon } from "../Icons";

const InfoModal = ({ open, onOk, onCancel, text }) => {
  return (
    <Modal
      width="450px"
      //title="Анхааруулга"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={
        <div className="flex gap-4 justify-end">
          <Button
            className="back border rounded-xl text-[13px] font-medium"
            onClick={onCancel}
          >
            Буцах
          </Button>
          <Button
            className="border-none rounded-xl font-semibold text-white bg-main"
            onClick={onOk}
          >
            Тийм
          </Button>
        </div>
      }
    >
      <div className="text-main flex justify-center">
        <WarningIcon width={60} height={60} />
      </div>
      <p className="pt-4 pb-2 text-center leading-5">{text}</p>
    </Modal>
  );
};

export default InfoModal;
