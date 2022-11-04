import { AxiosResponse } from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IChildrenNode, IUserContextProvider } from "../interface/TypesGlobal";
import { ILoginHookForm } from "../pages/Home/componentsHome/ModalLogin";
import { IRegisterHookForm } from "../pages/Home/componentsHome/ModalRegisterDev";
import { Api } from "../services/api/api";
import { toastError, toastSuccess } from "../styles/components/Toastify/toast";

export const userContext = createContext<IUserContextProvider>(
  {} as IUserContextProvider
);

interface IUserLogged {
  accessToken: string;
  user: {
    email: string;
    name: string;
    type: string;
    id: number;
  };
}

export const UserContextProvider = ({ children }: IChildrenNode) => {
  const [actualSectionHome, setActualSectionHome] = useState("home");
  const navigate = useNavigate();

  const loginUser = (data: ILoginHookForm) => {
    Api.post("/login", data)
      .then((res: AxiosResponse<IUserLogged>) => {
        const response = res.data;
        toastSuccess("Bem-vindo ao Dev's Help");
        if (response.user.type == "ong") {
          //redirecionar pra dash ong
        }

        if (response.user.type == "dev") {
          //redirecionar pra dash dev
        }
      })
      .catch((err) => {
        toastError("Dados inválidos!");
      });
  };

  const registerUser = (data: IRegisterHookForm) => {
    Api.post("/register", data)
      .then((res) => {
        toastSuccess("Cadastramos você, agora faça o login!");
        setActualSectionHome("login");
      })
      .catch((err) => {
        const error = err.response.data;
        if (error.includes("already")) {
          toastError("Email já existe!");
        } else {
          toastError("Dados inválidos!");
        }
      });
  };

  return (
    <userContext.Provider
      value={{
        loginUser,
        actualSectionHome,
        setActualSectionHome,
        registerUser,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
