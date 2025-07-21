import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { acceptTeamInvite } from "../lib/api";

const TeamInvite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const acceptInvite = async () => {
      try {
        const res = await acceptTeamInvite(token);
        if(res.status === 200) {
            setStatus("success");
        }else{
            throw new Error();
        }
      } catch (err) {
        if (err.response?.status === 409) {
          setStatus("alreadyAccepted");
        } else if (err.response?.status === 410) {
          setStatus("expired");
        } else {
          setStatus("error");
        }
      }
    };

    if (token) {
      acceptInvite();
    } else {
      setStatus("error");
    }
  }, [token, navigate]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return <p>Verifying invite...</p>;
      case "success":
        return <p className="text-green-600 font-semibold">✅ Invite accepted! Redirecting...</p>;
      case "alreadyAccepted":
        return <p className="text-yellow-600 font-semibold">⚠️ This invite has already been accepted.</p>;
      case "expired":
        return <p className="text-red-600 font-semibold">❌ Invite link has expired.</p>;
      default:
        return <p className="text-red-600 font-semibold">❌ Invalid or broken invite link.</p>;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Team Invite</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default TeamInvite;
