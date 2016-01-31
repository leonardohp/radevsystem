package com.radev.foundation.security;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.radev.foundation.entity.Usuario;
 
public class CredentialFilter implements Filter {
 
	public void destroy() {
    }
 
	public void doFilter(ServletRequest request, ServletResponse response,
                            FilterChain chain) throws IOException, ServletException {
		Usuario usuario = null;
	    HttpSession sess = ((HttpServletRequest) request).getSession(false);
	     
	    if (sess != null) {
	    	usuario = (Usuario) sess.getAttribute("usuarioLogado");
	    }      
	 	    
	    if (usuario == null) {
	    	request.getRequestDispatcher("../pages/index.xhtml").forward( request, response );  
	    } else {
	    	chain.doFilter(request, response);
	    }
	 
	}
 
	public void init(FilterConfig arg0) throws ServletException {
	}
 
}