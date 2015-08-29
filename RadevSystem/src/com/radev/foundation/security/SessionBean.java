package com.radev.foundation.security;

import java.io.Serializable;
import javax.faces.bean.ManagedBean;

import com.radev.foundation.entity.Empresa;
import com.radev.foundation.entity.Usuario;

@ManagedBean
public class SessionBean implements Serializable {

	private static final long serialVersionUID = 1L;
	private SessionContext session;
	private Credential credential = new Credential();
	private String user;
	private String password;
	
	public SessionBean() {
    	 session = SessionContext.getInstance();		
	}
		
	public void setUser(String user) {
		this.user = user;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
    public String getEmployer() {
    	Empresa empresa = session.getNomeEmpresa();
    	if (empresa != null)
    		return empresa.getNome();
    	else
    		return "";
	}
    
    public String getUser() {
    	Usuario usuario = session.getUsuarioLogado();
    	if (usuario != null)
    		return usuario.getLogin();
    	else
    		return "";
	}
	
    public String getPassword() {
    	return null;
    }
    
    public String login() {    	
    	return credential.login(this.user, this.password);
    }
    
    public String logout() {
    	return credential.doLogout();
    }
    
}
