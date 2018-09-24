.. image:: https://www.gnu.org/graphics/lgplv3-147x51.png
   :target: https://www.gnu.org/licenses/lgpl-3.0.en.html
   :alt: License: LGPL-v3

========
Scrummer
========

This module provides core UI components for development of
the agile methodologies on top of project_agile module.
Tasks on all clients are automatically updated, thanks
to the Web Syncer module. When task gets updated, Scrummer
displays a notification to the other users.


Usage
=====
In order to give an user access to the Scrummer, it must be
assigned to an Agile Team. This can be achieved from menu
Project > Agile > Teams.
Each team can work on multiple project, and more than one team
can work on a single project. Each user can be assigned to
multiple teams, but in Scrummer it is necessary to set the team
context.

In order for the Agile Team to have access to the projects,
it must have a type, and type must match the projects type
which must also have Use Agile enabled. This requires at least
one plugin module to be installed (Scrum, Kanban, etc.).

Next, board must be configured. Each plugin module comes with
simple board that can be used for viewing projects. Boards
act as view definitions, they define mapping from workflow state
to the board column, task types visible on board, etc.
Boards can be configured from menu Project > Boards. Boards
can only be create through Create Board wizard. Boards can work
with multiple workflows, so you must map states from each
workflow to the board column.

Example
-------
Take a look at following scenario:

We are creating different Boards for Developer and QA teams.
Developers work on tasks that are in ToDo column, following
workflow, tasks move through In progress to Developed state.
For developers, Developed state means that work is done, and
this state is mapped to the Done column of Development Board.
In QA Board, Developed state is mapped to ToDo column, since
those tasks are waiting to be tested. QA Board will not display
tasks in states that are not related to QA work, which enables
user to focus on what really matters.




Configuration
=============

For Web Syncer to work properly, you must ensure at least two
Workers in Odoo configuration and expose longpolling port.

Credits
=======


Contributors
------------
* Aleksandar Gajić <aleksandar.gajic@modoolar.com>
* Petar Najman <petar.najman@modoolar.com>
* Jasmina Nikolić <jasmina.nikolic@modoolar.com>
* Igor Jovanović <igor.jovanovic@modoolar.com>
* Miroslav Nikolić <miroslav.nikolic@modoolar.com>

Maintainer
----------

.. image:: https://www.modoolar.com/modoolar/static/modoolar-logo.png
   :alt: Modoolar
   :target: https://modoolar.com

This module is maintained by Modoolar.

::

   As Odoo Gold partner, our company is specialized in Odoo ERP customization and business solutions development.
   Beside that, we build cool apps on top of Odoo platform.

To contribute to this module, please visit https://modoolar.com
