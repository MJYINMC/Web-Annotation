import React from "react";
import { AntDesignOutlined, GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = "Powered by Ant Design"
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} | ${defaultMessage}`}
      links={[
        {
          key: 'Ant Design',
          title: <AntDesignOutlined />,
          href: 'https://ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/MJYINMC/Web-Annotation',
          blankTarget: true,
        }
      ]}
    />
  );
};
