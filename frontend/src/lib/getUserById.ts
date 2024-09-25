import { env } from "@env.mjs";
import { User } from "@portaljs/ckan";

export async function getUserById(id: string) {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_CKAN_URL}/api/3/action/user_show?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok)
        throw new Error(`Error fetching user data: ${response.statusText}`);
  
      const data = await response.json();
  
      if (data) 
        return data?.result as User
       else 
        return null;
  
    } catch (error) {
      console.error("Failed to retrieve user:", error);
    }
  }