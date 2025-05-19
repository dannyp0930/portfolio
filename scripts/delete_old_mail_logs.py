from datetime import datetime, timedelta
from prisma import Prisma

async def delete_old_mail_logs():
    prisma = Prisma()
    await prisma.connect()
    today = datetime.now()
    first_day_of_this_month = today.replace(day=1)
    first_day_of_last_month = (first_day_of_this_month - timedelta(days=1)).replace(day=1)
    try:
        deleted_logs = await prisma.maillog.delete_many(
            where={
                'createdAt': {
                    'lt': first_day_of_last_month,
                },
            }
        )
        print(f"Deleted {deleted_logs} old mail logs.")
    except Exception as e:
        print(f"Error deleting old mail logs: {e}")
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    import asyncio
    asyncio.run(delete_old_mail_logs())