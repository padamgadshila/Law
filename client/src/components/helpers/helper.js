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
    formData.append("cid", JSON.stringify(values.cid));

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

export let deleteClientData = async (cid) => {
  try {
    return await axios.delete(`/api/deleteClient?id=${cid}`, {
      headers: {
        Authorization: `Bearer ${getCookie()}`,
      },
    });
  } catch (error) {
    throw error;
  }
};
