export class AuditController {
  static async getLogsForEntity(req: AuthenticatedRequest, res: Response) {
    try {
      const { entityId, entityType } = req.query;

      const logs = await prisma.auditLog.findMany({
        where: {
          entityId: entityId as string,
          entityType: entityType as string,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return ApiResponse.success(res, logs);
    } catch (error) {
      return ApiResponse.error(res, "Failed to fetch audit logs");
    }
  }
}
