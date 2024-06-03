import { memo, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';

import { Button, Col, Drawer, Form, Input, Row, Space, Table, TableProps, Tag } from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';

import { getMenuLists } from '@/service/modules/menus';
import { IMenuDataList, type IMenuDataInfo } from '@/types';
import { getIcon } from '@/utils/router-handle';

interface IProps {
  children?: ReactNode;
}

const colItems = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 6
};

const menusColumns: TableProps<IMenuDataInfo>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center'
  },
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
    align: 'center'
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    align: 'center'
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    align: 'center',
    render: (icon) => getIcon(icon)
  },
  {
    title: '路由等级',
    dataIndex: 'grade',
    key: 'grade',
    align: 'center'
  },
  {
    title: '父级ID',
    dataIndex: 'pid',
    key: 'pid',
    align: 'center',
    render: (pid) => (pid === 0 ? '顶级菜单' : pid)
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (status) => {
      const color = status === 1 ? 'success' : 'error';
      const text = status === 1 ? '启用' : '禁用';
      return <Tag color={color}>{text}</Tag>;
    }
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: () => (
      <Space>
        <Button type="primary" icon={<EditOutlined />}>
          编辑
        </Button>
      </Space>
    )
  }
];

const Menus: FC<IProps> = () => {
  // 菜单搜索
  const [menuForm] = Form.useForm();
  // 菜单搜索信息
  const [searchInfo, setSearchInfo] = useState({
    page: 1,
    limit: 10,
    menuName: ''
  });
  // 菜单数据
  const [menuDataSource, setMenuDataSource] = useState<IMenuDataList>({
    total: 0,
    list: []
  });
  useEffect(() => {
    getMenuLists(searchInfo).then((res) => {
      setMenuDataSource(res);
    });
  }, [searchInfo]);

  // 搜索菜单
  const onClickMenusSearch = (values: any) => {
    setSearchInfo({ ...searchInfo, ...values });
  };

  // 重置表单
  const onClickResetForm = () => {
    menuForm.resetFields();
    setSearchInfo({ page: 1, limit: 10, menuName: '' });
  };

  // 菜单抽屉
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  // 关闭菜单抽屉
  const onClickCloseMenuDrawer = () => {
    setMenuDrawerOpen(false);
  };

  // 添加菜单
  const onClickCreateMenu = () => {
    setMenuDrawerOpen(true);
  };
  return (
    <>
      <Form autoComplete="off" onFinish={onClickMenusSearch} form={menuForm}>
        <Row gutter={20}>
          <Col {...colItems}>
            <Form.Item label="菜单名称" name="menuName">
              <Input placeholder="请输入菜单名称" />
            </Form.Item>
          </Col>
          <Col {...colItems}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜 索
              </Button>
              <Button icon={<UndoOutlined />} onClick={onClickResetForm}>
                重 置
              </Button>
              <Button icon={<PlusOutlined />} onClick={onClickCreateMenu}>
                添 加
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={menuDataSource.list}
        columns={menusColumns}
        rowKey={(record) => record.id}
        pagination={{
          current: 1,
          pageSize: 10,
          total: menuDataSource.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, limit) => {
            setSearchInfo({ ...searchInfo, page, limit });
          }
        }}
      />
      <Drawer title="添加菜单" size="large" open={menuDrawerOpen} onClose={onClickCloseMenuDrawer}></Drawer>
    </>
  );
};

export default memo(Menus);
