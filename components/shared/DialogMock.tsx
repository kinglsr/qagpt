/* eslint-disable tailwindcss/no-custom-classname */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Description } from "@/components/ui/description";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { Label } from "../ui/label";

interface DialogModalProps {
  onConfirm: () => void;
}

export default function DialogMock({ onConfirm }: DialogModalProps) {
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");

  const handleRoleChange = (e: any) => {
    setRole(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleLevelChange = (e: any) => {
    setLevel(e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("mock.role", role);
    localStorage.setItem("mock.description", description);
    localStorage.setItem("mock.level", level);
  };

  const cancelButtonRef = useRef(null);

  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => null}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-opacity-75/100 fixed inset-0 bg-gray-500 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                      <Cog8ToothIcon
                        className="size-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Set your mock interview preferences
                      </Dialog.Title>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-4">
                    <Label htmlFor="role">Role:</Label>
                    <Input
                      type="text"
                      id="role"
                      value={role}
                      onChange={handleRoleChange}
                      placeholder="DevOps Engineer"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="level">Interview Level:</Label>
                    <select
                      id="level"
                      value={level}
                      onChange={handleLevelChange}
                    >
                      <option value="">Select</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="description">Description:</Label>
                    <Description
                      placeholder="For E.g: 1. Ask me questions about Terraform, Kubernetes, and AWS. 2. I am looking for feedback on my communication skills and how I can improve my answers."
                      id="description"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      handleConfirm();
                      handleSave();
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleConfirm}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
