import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Secure the endpoint so only you can trigger it
    if (secret !== 'sandeep123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), 'old_database_backup.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
    }

    const fileData = fs.readFileSync(filePath, 'utf8');
    const backup = JSON.parse(fileData);

    const stats = {
      users: 0,
      domains: 0,
      members: 0,
      tasks: 0,
    };

    const userIdMap: Record<string, string> = {};

    // 1. Import Users
    if (backup.User) {
      for (const u of backup.User) {
        const cleanEmail = u.email.trim().toLowerCase();
        
        // Find existing user by ID or normalized email
        const existing = await prisma.user.findFirst({
          where: {
            OR: [
              { id: u.id },
              { email: cleanEmail }
            ]
          }
        });

        if (!existing) {
          const newUser = await prisma.user.create({
            data: {
              id: u.id,
              name: u.name,
              email: cleanEmail,
              password: u.password,
              createdAt: new Date(u.createdAt),
              updatedAt: new Date(u.updatedAt),
            }
          });
          userIdMap[u.id] = newUser.id;
          stats.users++;
        } else {
          // Update password in case there is a mismatch
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              password: u.password
            }
          });
          userIdMap[u.id] = existing.id;
        }
      }
    }

    // 2. Import Domains
    if (backup.Domain) {
      for (const d of backup.Domain) {
        const existing = await prisma.domain.findUnique({
          where: { id: d.id }
        });

        if (!existing) {
          await prisma.domain.create({
            data: {
              id: d.id,
              name: d.name,
              description: d.description,
              template: d.template,
              createdAt: new Date(d.createdAt),
              updatedAt: new Date(d.updatedAt),
            }
          });
          stats.domains++;
        }
      }
    }

    // 3. Import Domain Members
    if (backup.DomainMember) {
      for (const m of backup.DomainMember) {
        const actualUserId = userIdMap[m.userId] || m.userId;
        
        // Check if domain member exists using unique compound constraint (userId, domainId)
        const existing = await prisma.domainMember.findUnique({
          where: {
            userId_domainId: {
              userId: actualUserId,
              domainId: m.domainId
            }
          }
        });

        if (!existing) {
          const userExists = await prisma.user.findUnique({ where: { id: actualUserId } });
          const domainExists = await prisma.domain.findUnique({ where: { id: m.domainId } });

          if (userExists && domainExists) {
            await prisma.domainMember.create({
              data: {
                id: m.id,
                userId: actualUserId,
                domainId: m.domainId,
                role: m.role,
                status: m.status,
                pendingRole: m.pendingRole,
                createdAt: new Date(m.createdAt),
              }
            });
            stats.members++;
          }
        }
      }
    }

    // 4. Import Tasks
    if (backup.Task) {
      for (const t of backup.Task) {
        const actualCreatorId = userIdMap[t.creatorId] || t.creatorId;
        let actualAssigneeId = t.assigneeId ? (userIdMap[t.assigneeId] || t.assigneeId) : null;

        const existing = await prisma.task.findUnique({
          where: { id: t.id }
        });

        if (!existing) {
          const domainExists = await prisma.domain.findUnique({ where: { id: t.domainId } });
          const creatorExists = await prisma.user.findUnique({ where: { id: actualCreatorId } });

          if (domainExists && creatorExists) {
            if (actualAssigneeId) {
              const assigneeExists = await prisma.user.findUnique({ where: { id: actualAssigneeId } });
              if (!assigneeExists) {
                actualAssigneeId = null;
              }
            }

            await prisma.task.create({
              data: {
                id: t.id,
                title: t.title,
                description: t.description,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate ? new Date(t.dueDate) : null,
                domainId: t.domainId,
                assigneeId: actualAssigneeId,
                creatorId: actualCreatorId,
                createdAt: new Date(t.createdAt),
                updatedAt: new Date(t.updatedAt),
              }
            });
            stats.tasks++;
          }
        }
      }
    }
    const dbUsers = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    const dbDomains = await prisma.domain.findMany({ select: { id: true, name: true } });
    const backupSummary = {
      users: backup.User ? backup.User.map((u: any) => u.email) : [],
      domains: backup.Domain ? backup.Domain.map((d: any) => d.name) : []
    };

    return NextResponse.json({
      success: true,
      message: 'Data imported successfully!',
      stats,
      backupSummary,
      database: {
        users: dbUsers,
        domains: dbDomains
      }
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
