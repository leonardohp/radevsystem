package com.radev.foundation.security;

import java.io.Serializable;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;

import com.radev.foundation.controller.EmpresaController;
import com.radev.foundation.controller.UsuarioController;
import com.radev.foundation.controller.impl.EmpresaControllerImpl;
import com.radev.foundation.controller.impl.UsuarioControllerImpl;
import com.radev.foundation.entity.Empresa;
import com.radev.foundation.entity.Usuario;
  
public class Credential implements Serializable {
 
    private static final long serialVersionUID = -1L; 
    
    public String login(String user, String password) {
    	
    	UsuarioController usuarioController = new UsuarioControllerImpl();
    	Usuario usuario = usuarioController.findByLogin(user);

        if (usuario != null) {
        	
            if (usuario.getLogin().equals(user) && usuario.getSenha().equals(password) && usuario.isAtivo()) {
            	
            	SessionContext.getInstance().setAttribute("usuarioLogado", usuario);
            	
            	EmpresaController empresaController = new EmpresaControllerImpl();
            	Empresa empresa = empresaController.findFirst();
          	
            	SessionContext.getInstance().setAttribute("empresaUsuario", empresa);
            	
                return "menu";
            }
            
        }
        
        FacesMessage msg = new FacesMessage("Login inválido, tente novamente!", "WARNING");
        msg.setSeverity(FacesMessage.SEVERITY_WARN);
        FacesContext.getCurrentInstance().addMessage(null, msg);
         
        return "index";         
    }
     
    public String doLogout() {
        FacesMessage msg = new FacesMessage("Você saiu do sistema corretamente!", "INFO MSG");
        msg.setSeverity(FacesMessage.SEVERITY_INFO);
        SessionContext.getInstance().endSession();
        FacesContext.getCurrentInstance().addMessage(null, msg);
         
        return "index";
    }
}    