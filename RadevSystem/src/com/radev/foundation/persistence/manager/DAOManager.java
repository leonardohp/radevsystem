package com.radev.foundation.persistence.manager;

public interface DAOManager<T> {
	void persist(T entity) throws Exception;
	void merge(T entity) throws Exception;
	void delete(T entity) throws Exception;
}
