import { memo, useEffect, useState, useMemo, useCallback } from 'react';
import type { FC, Key, ReactNode } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Drawer,
  Tree,
  Switch,
  message,
  TreeProps,
  TreeDataNode,
  TableProps
} from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';

import type { IRoleListResult, IRoleInfo, IAddRoleField } from '@/types';
import { createRole, editRole, getRolesList } from '@/service/modules/roles';
import { getMenusList } from '@/service/modules/menus';
import { findCheckedKeys, mapTreeToTreeDataNode } from '@/utils/router-handle';

interface IProps {
  children?: ReactNode;
}

interface IRolesField {
  roleName: string;
}

interface IRoleSearchInfo extends IRolesField {
  page: number;
  limit: number;
}

const colItems = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 6
};

const Roles: FC<IProps> = () => {
  // 搜索条件
  const [searchInfo, setSearchInfo] = useState<IRoleSearchInfo>({ roleName: '', page: 1, limit: 10 });
  // 搜索表单
  const [roleForm] = Form.useForm<IRolesField>();
  // 角色列表
  const [roleData, setRoleData] = useState<IRoleListResult>();
  // 添加/编辑角色抽屉
  const [roleDrawer, setRoleDrawer] = useState<boolean>(false);
  // 添加/编辑角色表单
  const [addRoleForm] = Form.useForm<IAddRoleField>();
  // 角色权限列表
  const [roleList, setRoleList] = useState<TreeDataNode[]>([]);
  // 选中的角色权限
  const [checkedRoleKeys, setCheckedRoleKeys] = useState<Key[]>([]);
  // 编辑的角色信息
  const [editRoleInfo, setEditRoleInfo] = useState<IRoleInfo | null>(null);

  // 获取角色列表
  const fetchRolesList = useCallback(async () => {
    try {
      const result = await getRolesList(searchInfo);
      setRoleData(result);
    } catch (error) {
      message.error('Failed to fetch roles list');
    }
  }, [searchInfo]);

  // 获取角色权限列表
  useEffect(() => {
    fetchRolesList();
  }, [fetchRolesList]);

  // 搜索角色
  const onClickRolesSearch = useCallback((values: IRolesField) => {
    setSearchInfo((prev) => ({ ...prev, ...values }));
  }, []);

  // 重置搜索条件
  const onClickReset = useCallback(() => {
    roleForm.resetFields();
    setSearchInfo({ roleName: '', page: 1, limit: 10 });
  }, [roleForm]);

  // 关闭添加/编辑抽屉
  const onCloseDrawer = useCallback(() => {
    setRoleDrawer(false);
    addRoleForm.resetFields();
    setCheckedRoleKeys([]);
    setEditRoleInfo(null);
    setRoleList([]);
  }, [addRoleForm]);

  // 获取角色菜单/权限列表
  const fetchMenusList = async () => {
    const result = await getMenusList();
    return mapTreeToTreeDataNode(result);
  };

  // 选中角色权限
  const onCheckRole: TreeProps['onCheck'] = useCallback(
    (checked: Key[] | { checked: Key[]; halfChecked: Key[] }, info: any) => {
      const checkedKeys = Array.isArray(checked) ? checked : checked.checked;
      const allCheckedKeys = [...checkedKeys, ...info.halfCheckedKeys];
      setCheckedRoleKeys(checkedKeys);
      addRoleForm.setFieldsValue({ menuIds: allCheckedKeys.map(String) });
    },
    [addRoleForm]
  );

  // 提交添加/编辑角色
  const onClickSubmitRole = useCallback(
    async (values: IAddRoleField) => {
      try {
        let result;
        if (editRoleInfo) {
          result = await editRole(editRoleInfo.id, values);
        } else {
          result = await createRole(values);
        }
        if (result) {
          setRoleDrawer(false);
          fetchRolesList();
        }
      } catch (error) {
        message.error('Failed to submit role');
      }
    },
    [editRoleInfo, fetchRolesList]
  );

  // 编辑角色
  const onClickEditRole = useCallback(
    async (info: IRoleInfo) => {
      const roleList = await fetchMenusList();
      setRoleList(roleList);
      setEditRoleInfo(info);
      const checkedKeys = findCheckedKeys(roleList, info.menuIds);
      setCheckedRoleKeys(checkedKeys);
      addRoleForm.setFieldsValue({
        roleName: info.roleName,
        menuIds: info.menuIds,
        status: info.status === 1
      });
      setRoleDrawer(true);
    },
    [roleList, addRoleForm]
  );

  const onClickCreateRole = useCallback(async () => {
    const roleList = await fetchMenusList();
    setRoleList(roleList);
    setRoleDrawer(true);
  }, []);

  // 表格列
  const rolesColumns: TableProps<IRoleInfo>['columns'] = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
      },
      {
        title: '角色名',
        dataIndex: 'roleName',
        key: 'roleName',
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
        title: '操作',
        key: 'action',
        align: 'center',
        render: (info) => (
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={() => onClickEditRole(info)}>
              编辑
            </Button>
          </Space>
        )
      }
    ],
    [onClickEditRole]
  );

  // 分页配置
  const paginationConfig = useMemo(
    () => ({
      current: searchInfo?.page,
      pageSize: searchInfo?.limit,
      total: roleData?.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条`,
      onChange: (page: number, limit: number) => {
        setSearchInfo({ ...searchInfo, page, limit });
      }
    }),
    [searchInfo, roleData]
  );

  return (
    <>
      <Form form={roleForm} onFinish={onClickRolesSearch} autoComplete="off">
        <Row gutter={20}>
          <Col {...colItems}>
            <Form.Item label="角色名" name="roleName">
              <Input />
            </Form.Item>
          </Col>
          <Col {...colItems}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜 索
                </Button>
                <Button onClick={onClickReset} icon={<UndoOutlined />}>
                  重 置
                </Button>
                <Button icon={<PlusOutlined />} onClick={onClickCreateRole}>
                  添 加
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={roleData?.data}
        columns={rolesColumns}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
      />
      <Drawer size="large" title={editRoleInfo ? '编辑角色' : '添加角色'} open={roleDrawer} onClose={onCloseDrawer}>
        <Form form={addRoleForm} onFinish={onClickSubmitRole} initialValues={{ status: true }} autoComplete="off">
          <Form.Item<IAddRoleField>
            label="角色名"
            name="roleName"
            rules={[
              {
                required: true,
                message: '请输入角色名'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<IAddRoleField>
            label="角色权限"
            name="menuIds"
            rules={[
              {
                required: true,
                message: '请选择角色权限'
              }
            ]}
          >
            <Tree checkable treeData={roleList} onCheck={onCheckRole} checkedKeys={checkedRoleKeys} />
          </Form.Item>
          <Form.Item<IAddRoleField>
            label="是否启用"
            name="status"
            rules={[
              {
                required: true,
                message: '请选择是否启用'
              }
            ]}
          >
            <Switch
              onChange={(checked) => {
                addRoleForm.setFieldsValue({ status: checked });
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提 交
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default memo(Roles);
