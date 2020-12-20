import PropTypes from "prop-types";
import React from "react";

function Layout({ children }) {
  return (
    <div>
      <main>{children}</main>

      <footer
        className="fixed  "
        style={{
          right: "2rem",
          bottom: "4rem",
        }}
      >
        <div
          className="flex align-center p-2"
          style={{
            boxShadow:
              "0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)",
            backgroundColor: "#fff",
            borderRadius: "5px",
          }}
        >
          <a
            className="block mx-2 font-bold no-underline text-center"
            href="https://twitter.com/iliashaddad3"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made By Ilias 🇲🇦
          </a>
          <img
            src="https://pbs.twimg.com/profile_images/1323272518824767489/0Roq4rqd_400x400.jpg"
            className="block h-8 w-8 rounded-full"
          />
        </div>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
