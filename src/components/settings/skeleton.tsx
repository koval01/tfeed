import { SimpleCell, Skeleton as VKSkeleton } from "@vkontakte/vkui";

const Skeleton = ({ count }: { count: number }) => (
    [...Array(count)].map((_, i) => (
        <SimpleCell
            key={i}
            indicator={<VKSkeleton width={72} className="mr-4" />}
            before={<VKSkeleton width={28} height={28} borderRadius="15%" />}
            after={<VKSkeleton width={28} />}
        >
            <VKSkeleton width={120} />
        </SimpleCell>
    ))
)

export default Skeleton;
