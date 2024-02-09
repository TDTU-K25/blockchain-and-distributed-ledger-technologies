import { Dispatch, SetStateAction, useState } from "react";

interface ModalProps {
  isShowModal: boolean;
  setIsShowModal: Dispatch<SetStateAction<boolean>>;
  finishDelete: (e: any) => Promise<void>;
}

export default function Modal(props: ModalProps) {
  const { isShowModal, setIsShowModal, finishDelete } = props;
  return (
    <>
      {isShowModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-red-500">
                    Delete this item?
                  </h3>
                  <button
                    className="p-1 ml-auto  border-0 text-black  float-right text-3xl  font-semibold"
                    onClick={() => setIsShowModal(false)}
                  >
                    <span className="bg-transparent text-black-500 h-6 w-6 text-2xl block">
                      ×
                    </span>
                  </button>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    type="button"
                    onClick={() => setIsShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    type="button"
                    onClick={(event) => {
                      setIsShowModal(false);
                      finishDelete(event);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
