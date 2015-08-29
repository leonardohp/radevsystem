package com.radev.foundation.persistence.manager;

import javax.persistence.EntityManager; 
import javax.persistence.EntityManagerFactory; 
import javax.persistence.Persistence; 

public class DBEntityManager {
	
	private static EntityManagerFactory emf; 
	
	public synchronized static EntityManager getConnection() {
		
		if (emf == null) {
			emf = Persistence.createEntityManagerFactory("radevsystem");			
		}	
		
		return emf.createEntityManager();
	} 
	
}
