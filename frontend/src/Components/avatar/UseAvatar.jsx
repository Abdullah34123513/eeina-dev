const UserAvatar = ({ user, size = "md" }) => {
      const sizes = {
            xs: "w-8 h-8 text-sm",
            sm: "w-10 h-10 text-base",
            md: "w-12 h-12 text-lg",
      };

      return (
            <div
                  className={`rounded-full ${sizes[size]} flex items-center justify-center 
      ${
            user?.image?.url && user.image.url !== "default.webp"
                  ? "bg-gray-100"
                  : "bg-primary text-white"
      }`}
            >
                  {user?.image?.url && user.image.url !== "default.webp" ? (
                        <img
                              src={user.image.url}
                              alt="Avatar"
                              className="w-full h-full object-cover rounded-full"
                        />
                  ) : (
                        <span>{user?.firstName?.[0]}</span>
                  )}
            </div>
      );
};

export default UserAvatar;
