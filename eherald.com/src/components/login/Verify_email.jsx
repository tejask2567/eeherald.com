import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Correctly import useParams

export const Verify_email = () => {
  const { token } = useParams(); // Extract token from the URL parameters
  const [status, setStatus] = useState(false);

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/auth/verify-email/${token}` // Send token as path param
      );
      if (response.status === 200) {
        setStatus(true);
      }
      // If request is successful, mark as verified
    } catch (error) {
      console.error("Verification failed", error);
    }
  };

  if (!status) {
    return (
      <>
        <p>
          Click <button onClick={handleVerify}>here</button> to verify your
          email.
        </p>
      </>
    );
  } else {
    return (
      <>
        <p>Thank you for verifying your email!</p>
      </>
    );
  }
};
