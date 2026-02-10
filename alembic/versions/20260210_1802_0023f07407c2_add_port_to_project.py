"""add_port_to_project

Revision ID: 0023f07407c2
Revises: 09bccedf98c5
Create Date: 2026-02-10 18:02:24.176839

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0023f07407c2'
down_revision: Union[str, None] = '09bccedf98c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 添加 port 字段
    op.add_column('projects', sa.Column('port', sa.Integer(), nullable=True))


def downgrade() -> None:
    # 删除 port 字段
    op.drop_column('projects', 'port')
