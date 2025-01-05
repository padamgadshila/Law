import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

let getCookie = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

export let auth = async () => {
  try {
    return await axios.post(
      "/api/auth",
      {},
      {
        headers: { Authorization: `Bearer ${getCookie()}` },
      }
    );
  } catch (error) {
    throw error;
  }
};

export let login = async (values) => {
  try {
    return await axios.post("/api/login", values);
  } catch (error) {
    throw error;
  }
};

export let addClientInfo = async (values) => {
  try {
    return await axios.post("/api/addClient", values, {
      headers: { Authorization: `Bearer ${getCookie()}` },
    });
  } catch (error) {
    throw error;
  }
};

export let addClientDocuments = async ({ documents, values }) => {
  try {
    let formData = new FormData();

    documents.forEach((doc, i) => {
      formData.append(`documentType-${i}`, doc.documentType);
      formData.append(`document-${i}`, doc.document);
    });

    formData.append("info", JSON.stringify(values.info));
    formData.append("_id", JSON.stringify(values._id));

    return await axios.post("/api/addClientDocument", formData, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export let getClients = async () => {
  try {
    return await axios.get("/api/getClients", {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export let deleteClientData = async (_id) => {
  try {
    return await axios.delete(`/api/deleteClient?id=${_id}`, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export let getClientDocuments = async (_id) => {
  try {
    return await axios.get(`/api/clientDoc?id=${_id}`, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const FileView = ({ filename }) => {
  const handleViewFile = () => {
    window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/${filename}`, "_blank");
  };

  return (
    <button
      className="text-blue-500 text-center hover:underline"
      onClick={handleViewFile}
    >
      View
    </button>
  );
};

export const FileDownload = ({ filename }) => {
  return (
    <a
      href={`${process.env.REACT_APP_SERVER_DOMAIN}/api/download/${filename}`}
      download={filename}
      className="text-green-500 hover:underline"
      target="_blank"
      rel="noreferrer"
    >
      Download
    </a>
  );
};

export const getOneClientBYId = async (id) => {
  try {
    return await axios.get(`/api/clientData?id=${id}`, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateClient = async (values) => {
  try {
    return await axios.put("/api/updateClient", values, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getEmployee = async () => {
  try {
    return await axios.get("/api/getEmployee?role=employee", {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteEmployeeData = async (id) => {
  try {
    return await axios.delete(`/api/deleteEmployee?id=${id}&role=employee`, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export let addEmployee = async (values) => {
  try {
    return await axios.post("/api/addEmployee", values, {
      headers: { Authorization: `Bearer ${getCookie()}` },
    });
  } catch (error) {
    throw error;
  }
};

export const getOneEmployeeById = async (id) => {
  try {
    return await axios.get(`/api/employeeData?id=${id}&role=employee`, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (values) => {
  try {
    return await axios.put("/api/updateEmployee", values, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export let getProfileInfo = async (id, role) => {
  try {
    return await axios.get(`/api/profile?id=${id}&role=${role}`, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export let updateProfile = async (values) => {
  try {
    return await axios.post(`/api/updateProfile?id=${values._id}`, values, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export let sendMail = async (data) => {
  try {
    return await axios.post("/api/sendMail", data);
  } catch (error) {
    throw error;
  }
};

export let verifyEmail = async (values) => {
  try {
    return await axios.post("/api/sendOtp", values);
  } catch (error) {
    throw error;
  }
};

export let getProfilePic = async (email) => {
  try {
    return await axios.get(`/api/getProfilePic?email=${email}`);
  } catch (error) {
    throw error;
  }
};

export let resSendOtp = async (email) => {
  try {
    return await axios.post("/api/resendOtp", { email: email });
  } catch (error) {
    throw error;
  }
};

export let verifyOtp = async (data) => {
  try {
    return await axios.post("/api/verifyOtp", data);
  } catch (error) {
    throw error;
  }
};

export let resetPassword = async (data) => {
  try {
    return await axios.put("/api/resetpass", data);
  } catch (error) {
    throw error;
  }
};
