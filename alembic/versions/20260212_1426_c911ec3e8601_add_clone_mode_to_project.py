"""add clone_mode to project

Revision ID: c911ec3e8601
Revises: 0023f07407c2
Create Date: 2026-02-12 14:26:43.525308

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c911ec3e8601"
down_revision: Union[str, None] = "0023f07407c2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 添加 clone_mode 列，默认值为 'static'（兼容已有项目）
    op.add_column(
        "projects",
        sa.Column(
            "clone_mode",
            sa.Enum("STATIC", "PROXY", name="clonemode"),
            nullable=False,
            server_default="STATIC",
        ),
    )


def downgrade() -> None:
    op.drop_column("projects", "clone_mode")
