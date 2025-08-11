import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AnimatePresence } from 'framer-motion';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import AuthInitial from './AuthInitial/AuthInitial';
import { useSelector } from 'react-redux';
import ForgetPassword from './ForgetPassword/ForgetPassword';
import SetNewPassword from './SetNewPassword/SetNewPassword';
import GetUserAccountMail from './GetUserAccountMail/GetUserAccountMail';
// import AgeGender from './UserPersonalData/Age&Gender';
// import OtherPersonalData from './UserPersonalData/OtherPersonalData';
// import UserDataOverView from './UserDataOverView/UserDataOverView';

// Set the app element for accessibility
Modal.setAppElement('#root');

// Define fade variants with no vertical movement
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const AuthModals = ({ isOpen, onClose }) => {
  const [modalType, setModalType] = useState('initial'); // change to 'initial' to show the initial modal after testing
  const [email, setEmail] = useState('');
  const { isModalOpen } = useSelector((state) => state.modal);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome requires returnValue to be set
    };

    if (modalType === 'forgetPassword' || modalType === 'setNewPassword' || modalType === 'emailVerifyOtp') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [modalType]);


  // Disable mouse and keyboard scroll when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Define keys that trigger scrolling
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
      }
    };

    if (isModalOpen) {
      // Disable mouse scroll
      document.body.style.overflow = 'hidden';
      // Disable keyboard scrolling
      window.addEventListener('keydown', handleKeyDown, { passive: false });
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }

    // Cleanup on unmount or when isModalOpen changes
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Close modal and reset modalType
  const closeModal = () => {
    setModalType('initial'); // change to 'initial' to show the initial modal after testing
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Authentication Modal"
      overlayClassName="fixed z-[9999999] inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      className="outline-none"
      shouldCloseOnOverlayClick={false} // prevents closing on outside click
    >

      <AnimatePresence exitBeforeEnter>
        {modalType === 'initial' && (
          <AuthInitial
            setModalType={setModalType}
            closeModal={closeModal}
            fadeVariants={fadeVariants}
          />
        )}


        {modalType === 'login' && (
          <Login fadeVariants={fadeVariants} setModalType={setModalType} />
        )}

        {modalType === 'signup' && (
          <SignUp fadeVariants={fadeVariants} setModalType={setModalType} setEmail={setEmail} />
        )}

        {modalType === 'getUserMail' && (
          <GetUserAccountMail fadeVariants={fadeVariants} setModalType={setModalType} setEmail={setEmail} />
        )}

        {modalType === 'emailVerifyOtp' && (
          <ForgetPassword fadeVariants={fadeVariants} setModalType={setModalType} email={email} setEmail={setEmail} type="emailVerifyOtp" />
        )}

        {modalType === 'forgetPassword' && (
          <ForgetPassword fadeVariants={fadeVariants} setModalType={setModalType} email={email} setEmail={setEmail} type="forgetPassword" />
        )}

        {modalType === 'setNewPassword' && (
          <SetNewPassword fadeVariants={fadeVariants} setModalType={setModalType} email={email} />
        )}
        {/* {
          modalType === 'ageGender' && (
            <AgeGender fadeVariants={fadeVariants} setModalType={setModalType} />
          )
        }
        {modalType === 'otherPersonalData' && (
          <OtherPersonalData fadeVariants={fadeVariants} setModalType={setModalType} />
        )}
        {
          modalType === 'showCaseUserPersonalData' && (
            <UserDataOverView fadeVariants={fadeVariants} setModalType={setModalType} />
          )
        } */}
      </AnimatePresence>
    </Modal>
  );
};

AuthModals.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthModals;
