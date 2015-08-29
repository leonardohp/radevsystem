package com.radev.foundation.security;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import com.radev.foundation.entity.Empresa;
import com.radev.foundation.entity.Usuario;
 
 
public class SessionContext {
    
    private static SessionContext instance;
    
    public static SessionContext getInstance() {
    	if (instance == null){
    		instance = new SessionContext();
    	}
	 
    	return instance;
    }
    
    private SessionContext() {
         
    }
    
    private ExternalContext currentExternalContext(){
    	if (FacesContext.getCurrentInstance() == null){
             throw new RuntimeException("O FacesContext não pode ser chamado fora de uma requisição HTTP");
        } else {
        	return FacesContext.getCurrentInstance().getExternalContext();
        }
    }
    
    public Usuario getUsuarioLogado(){
    	return (Usuario) getAttribute("usuarioLogado");
    }
    
    public void setUsuarioLogado(Usuario usuario){
    	setAttribute("usuarioLogado", usuario);
    }

    public void setEmpresaUsuario(Empresa empresa){
    	setAttribute("empresaUsuario", empresa);
    }
    
    public void endSession(){   
    	currentExternalContext().invalidateSession();
    }
    
    public Object getAttribute(String param){
    	return currentExternalContext().getSessionMap().get(param);
    }
    
    public void setAttribute(String key, Object value) {
        currentExternalContext().getSessionMap().put(key, value);
    }

	public Empresa getNomeEmpresa() {
		return (Empresa) getAttribute("empresaUsuario");
	}
   
}