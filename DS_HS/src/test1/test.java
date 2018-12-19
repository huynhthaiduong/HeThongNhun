package test1;

import java.sql.Connection;
import myclass.DataConnection;


public class test{
	public static void main(String[] args) {
		Connection c = DataConnection.getConnection();
        if (c == null) {
            System.out.println("something wrong");
        } else {
            System.out.println("ok");
        }
}
}
